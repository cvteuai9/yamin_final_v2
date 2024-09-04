import React from 'react'
import Image from 'next/image'

export default function StarPage() {
  return (
    <>
      <div className={`star-page mb-4"`}>
        <Image src="/images/star.png" alt="" width={16} height={16} />
        <img
          src="/images/Vector 25.png"
          alt=""
          width="100%"
          height="1.5px"
          style={{ margin: '0 -2px' }}
        />
        <Image src="/images/star.png" alt="" width={16} height={16} />
      </div>
    </>
  )
}
