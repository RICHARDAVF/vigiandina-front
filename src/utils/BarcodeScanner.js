'use client';

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onScanError, qrCodeContainerId, isModalOpen}) => {
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        let timeoutId;
        if (isModalOpen) {
            timeoutId = setTimeout(() => {
                html5QrcodeScannerRef.current = new Html5QrcodeScanner(
                    qrCodeContainerId,
                    { fps: 5, qrbox: { width: 300, height: 100 } },
                    false 
                );
                html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
            }, 0); 
        }

        return () => {
            clearTimeout(timeoutId);
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
