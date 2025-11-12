'use client';

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onScanError, qrCodeContainerId, isModalOpen, isScanning }) => {
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        let timeoutId;
        if (isModalOpen && !html5QrcodeScannerRef.current) {
            // Añadir un pequeño retardo para asegurar que el DOM esté listo
            timeoutId = setTimeout(() => {
                html5QrcodeScannerRef.current = new Html5QrcodeScanner(
                    qrCodeContainerId,
                    { fps: 10, qrbox: { width: 200, height: 200 } },
                    false // verbose
                );
                html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
            }, 0); // Retardo de 0ms para ejecutar en el siguiente tick del evento
        }

        return () => {
            clearTimeout(timeoutId);
            // Detener el escáner cuando el componente se desmonte o el modal se cierre
            if (html5QrcodeScannerRef.current) {
                html5QrcodeScannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner", error);
                }).finally(() => {
                    html5QrcodeScannerRef.current = null;
                });
            }
        };
    }, [onScanSuccess, onScanError, qrCodeContainerId, isModalOpen]);

    return <div id={qrCodeContainerId} />;
};

export default BarcodeScanner;
