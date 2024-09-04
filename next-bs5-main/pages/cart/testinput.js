import { formToJSON } from 'axios'
import React from 'react'

export default function testinput() {
  return (
    <form>
      <input type="text" required />
      <button>送出</button>
    </form>
  )
}
