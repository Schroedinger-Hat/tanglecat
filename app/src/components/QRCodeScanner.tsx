'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface QRCodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [data, setData] = useState('')

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const startScanning = async (): Promise<Html5QrcodeScanner> => {
      const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
        qrbox: {
            width: 250,
            height: 250,
        },
        fps: 5,
        }, false);

      await html5QrcodeScanner.render(
        (result) => {
            setData(result)
            onScan(result)
        },
        (error) => {
            console.info(error)
        }
    )
      return html5QrcodeScanner;
    };

    const initScanner = async () => {
      if (isMounted.current) {
        scannerRef.current = await startScanning();
      }
    };

    initScanner();

    // cleanup function when component will unmount
    return () => {
      isMounted.current = false;
      const clearScanner = async () => {
        try {
          if (scannerRef.current) await scannerRef.current.clear();
        } catch (error) {
          console.log('Failed to clear html5QrcodeScanner. ', error);
        }
      };
      clearScanner();
    };
  }, [onScan, onClose]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div id="reader"></div>
      {data && (
        <p className="mt-2 text-sm text-gray-600">
          Scanned data: {data}
        </p>
      )}
    </div>
  )
}