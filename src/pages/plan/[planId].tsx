import * as React from 'react'
import { useRouter } from 'next/router'

const Plan = () => {
  const router = useRouter()
  const { planId } = router.query

  console.log(planId)
  console.log(router.query)

  return <>{planId}</>
}

export default Plan
