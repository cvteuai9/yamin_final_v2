import { useState, useEffect } from 'react'

export function YaminCoupon() {
  const [selectedValue, setSelectedValue] = useState('')

  return [selectedValue, setSelectedValue]
}
