import 'core-js'
import React, { useEffect } from 'react'

const Button = () => {

  useEffect(() => {
    const t = new Promise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 1000)
    })
  }, [])

  return (
    <button>button</button>
  )
}

export default Button