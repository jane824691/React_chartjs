import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    // 一開啟瀏覽器首頁即自動導向/chartJs頁面
    if (typeof window !== 'undefined') {
      router.push('/chartJs')
    }
  }, [])

  return <></>
}

export default Index
