import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Navbar() {
  const router = useRouter()

  return (
    <div>
      <ul className="nav nav-underline mx-5 mt-3">
      <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-5 px-3"
            onClick={() => {
              router.push('../chartJs')
            }}
          >
            所有數據
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-5 px-3"
            onClick={() => {
              router.push('../chartJs/jan')
            }}
          >
            1 月數據
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-5 px-3"
            onClick={() => {
              router.push('../chartJs/feb')
            }}
          >
            2 月數據
          </button>
        </li>
      </ul>
    </div>
  )
}
