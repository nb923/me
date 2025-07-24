import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to 21st.dev</CardTitle>
          <CardDescription>
            Beautiful components are now working!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter your email" />
          <Button className="w-full">Get Started</Button>
          <Button variant="outline" className="w-full">Learn More</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
