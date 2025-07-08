import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-2'>
      <h1>Hello World!</h1>
      <Button>
        Click Me
      </Button>
    </div>
  )
}
