document.addEventListener("DOMContentLoaded", () => {
    const svgObject = document.getElementById("svg-map");
    const popup = document.getElementById("popup");
    const popupVideo = document.getElementById("popup-video");
    const closePopup = document.getElementById("close-popup");

    popup.style.display = "none"; // Ocultar popup al inicio

    svgObject.addEventListener("load", () => {
        const svgDoc = svgObject.contentDocument;
        const svgElement = svgDoc.documentElement;

        // Configurar el viewBox si no está definido
        let viewBox = svgElement.getAttribute("viewBox");
        if (!viewBox) {
            const width = svgElement.clientWidth || 1000;
            const height = svgElement.clientHeight || 1000;
            viewBox = `0 0 ${width} ${height}`;
            svgElement.setAttribute("viewBox", viewBox);
        }

        let [x, y, width, height] = viewBox.split(" ").map(Number);
        let isPanning = false, startX, startY;
        
        // 🔍 ZOOM CON RUEDA DEL MOUSE (FUNCIONA BIEN)
        svgElement.addEventListener("wheel", (event) => {
            event.preventDefault();

            const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9; // Zoom in/out
            const rect = svgObject.getBoundingClientRect();

            // Obtener posición relativa del mouse en el SVG
            const mouseX = ((event.clientX - rect.left) / rect.width) * width + x;
            const mouseY = ((event.clientY - rect.top) / rect.height) * height + y;

            // Aplicar zoom respetando el punto focal del mouse
            let newWidth = Math.max(100, Math.min(5000, width * zoomFactor));
            let newHeight = Math.max(100, Math.min(5000, height * zoomFactor));

            let newX = mouseX - (mouseX - x) * zoomFactor;
            let newY = mouseY - (mouseY - y) * zoomFactor;

            width = newWidth;
            height = newHeight;
            x = newX;
            y = newY;

            svgElement.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
        });

        // 🔹 Cargar marcadores desde markers.json
        fetch('/api/markers')
        .then(response => response.json())
        .then(data => {
            data.forEach(marker => {
                const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", 
                    `${marker.x1},${marker.y1} 
                     ${marker.x2},${marker.y2} 
                     ${marker.x3},${marker.y3} 
                     ${marker.x4},${marker.y4}`
                );
                polygon.style.fill = "red"; // Para que los marcadores sean visibles
                polygon.style.opacity = "0"; // Semi-transparente
                polygon.style.pointerEvents = "auto";

                polygon.addEventListener("click", () => {
                    popup.style.display = "flex";
                    popupVideo.src = marker.video;
                });

                svgElement.appendChild(polygon);
            });
        })
        .catch(error => console.error("Error cargando markers:", error));
    });

    // ❌ Cerrar popup
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
        popupVideo.src = "";
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
            popupVideo.src = "";
        }
    });
});
