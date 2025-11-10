'use client'

import React from 'react'

export const SidebarLogo = () => {
  return (
    <div style={{
      width: '100%',
      padding: '20px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <img
        src="/campus-logo.png"
        alt="Campus Multiplataforma"
        style={{
          maxWidth: '180px',
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
