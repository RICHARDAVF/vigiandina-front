import React from 'react';
import { Modal as MyModal } from 'antd';
export default function Modal ({  children, ...props}){
  return (<MyModal {...props}
  >
    {children}
  </MyModal>
  );
};
