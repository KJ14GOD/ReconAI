// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Banknote, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"

// export default function LinkAccountPage() {
//   const navigate = useNavigate()

//   const [companyId, setCompanyId] = useState("")
//   const [userId, setUserId] = useState("")
//   const [token, setToken] = useState("")
//   const [isLinking, setIsLinking] = useState(false)

//   const handleConnect = () => {
//     if (!companyId || !userId || !token) {
//       alert("Please fill in all fields")
//       return
//     }

//     setIsLinking(true)
//     setTimeout(() => {
//       setIsLinking(false)
//       navigate("/dashboard")
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <Card className="max-w-md w-full shadow-lg">
//         <CardHeader>
//           <div className="flex items-center gap-2 mb-2">
//             <Banknote className="h-6 w-6 text-primary" />
//             <CardTitle className="text-2xl font-bold">Connect Your Bank</CardTitle>
//           </div>
//           <CardDescription className="text-muted-foreground">
//             Securely link your Bank of America account to automatically import your transactions.
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4 text-sm text-muted-foreground">
//           <div className="space-y-2">
//             <Label htmlFor="companyId">Company ID</Label>
//             <Input
//               id="companyId"
//               placeholder="Enter your Company ID"
//               value={companyId}
//               onChange={(e) => setCompanyId(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="userId">User ID</Label>
//             <Input
//               id="userId"
//               placeholder="Enter your User ID"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="token">Sandbox Token</Label>
//             <Input
//               id="token"
//               type="password"
//               placeholder="Enter your Token"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//             />
//           </div>

//           <div className="flex items-start gap-3 pt-2 border-t border-border mt-4">
//             <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
//             <span>We use bank-grade encryption and never store your credentials.</span>
//           </div>

//           <div className="flex items-start gap-3">
//             <ArrowRight className="h-5 w-5 text-blue-500 mt-1" />
//             <span>
//               Linking your account helps us reconcile your invoices and bank data automatically.
//             </span>
//           </div>
//         </CardContent>

//         <CardFooter>
//           <Button className="w-full" onClick={handleConnect} disabled={isLinking}>
//             {isLinking ? (
//               <span className="flex items-center">
//                 <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                 Connecting...
//               </span>
//             ) : (
//               "Connect with Bank of America"
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


// import { useEffect, useRef, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Banknote, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"

// export default function LinkAccountPage() {
//   const navigate = useNavigate()
//   const tellerRef = useRef(null)
//   const [isLinking, setIsLinking] = useState(false)

//   // Add script only once
//   useEffect(() => {
//     if (!document.getElementById("teller-connect-script")) {
//       const script = document.createElement("script")
//       script.src = "https://cdn.teller.io/connect/connect.js"
//       script.id = "teller-connect-script"
//       script.async = true
//       document.body.appendChild(script)
//     }
//   }, [])

//   const handleConnect = () => {
//     if (!window.TellerConnect) {
//       console.error("TellerConnect is not loaded yet.")
//       return
//     }

//     const connect = window.TellerConnect.setup({
//       applicationId: "app_pcb3duk4v6vv49p8jk000", // your sandbox app ID
//       environment: "sandbox",
//       onSuccess: function(auth)  {
//         console.log("Teller access token", auth.accessToken)
//         // Save the enrollment.id or access_token locally or send to backend
//         localStorage.setItem("teller_enrollment_id", enrollment.enrollment)
//         navigate("/dashboard")
//       },
//       onExit: () => {
//         console.log("User exited Teller Connect")
//       }
//     })
//     connect.open()
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <Card className="max-w-md w-full shadow-lg">
//         <CardHeader>
//           <div className="flex items-center gap-2 mb-2">
//             <Banknote className="h-6 w-6 text-primary" />
//             <CardTitle className="text-2xl font-bold">Connect Your Bank</CardTitle>
//           </div>
//           <CardDescription className="text-muted-foreground">
//             Securely link your bank account to automatically import your transactions.
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4 text-sm text-muted-foreground">
//           <div className="flex items-start gap-3 pt-2 border-t border-border mt-4">
//             <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
//             <span>We use bank-grade encryption and never store your credentials.</span>
//           </div>

//           <div className="flex items-start gap-3">
//             <ArrowRight className="h-5 w-5 text-blue-500 mt-1" />
//             <span>Linking your account helps us reconcile your invoices and bank data automatically.</span>
//           </div>
//         </CardContent>

//         <CardFooter>
//           <Button className="w-full" onClick={handleConnect} disabled={isLinking}>
//             {isLinking ? (
//               <span className="flex items-center">
//                 <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                 Connecting...
//               </span>
//             ) : (
//               "Connect with Teller"
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"

export default function LinkAccountPage() {
  const navigate = useNavigate()
  const [isLinking, setIsLinking] = useState(false)
  const tellerRef = useRef(null)

  // ✅ Load Teller Connect only once
  useEffect(() => {
    if (window.TellerConnectHandler) return

    const script = document.createElement("script")
    script.src = "https://cdn.teller.io/connect/connect.js"
    script.async = true
    script.onload = () => {
      tellerRef.current = window.TellerConnect.setup({
        applicationId: "app_pcb3duk4v6vv49p8jk000", // replace with your Teller sandbox ID
        environment: "sandbox",
        onSuccess: (auth) => {
          console.log("✅ Teller access token:", auth.accessToken)
          localStorage.setItem("teller_access_token", auth.accessToken)
          //navigate("/dashboard")
          navigate(`/dashboard?access_token=${auth.accessToken}`);
        },
        onExit: () => {
          console.log("❌ User exited Teller flow")
          setIsLinking(false)
        }
      })

      window.TellerConnectHandler = tellerRef.current
    }

    document.body.appendChild(script)
  }, [navigate])

  const handleConnect = () => {
    if (!window.TellerConnectHandler) {
      alert("Teller Connect is still loading. Please try again in a second.")
      return
    }

    setIsLinking(true)
    window.TellerConnectHandler.open()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Connect Your Bank</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Securely link your bank account to automatically import your transactions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 pt-2 border-t border-border mt-4">
            <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
            <span>We use bank-grade encryption and never store your credentials.</span>
          </div>

          <div className="flex items-start gap-3">
            <ArrowRight className="h-5 w-5 text-blue-500 mt-1" />
            <span>
              Linking your account helps us reconcile your invoices and bank data automatically.
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleConnect} disabled={isLinking}>
            {isLinking ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Connecting...
              </span>
            ) : (
              "Connect Your Bank"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
