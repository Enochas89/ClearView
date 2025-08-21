import { createContext, useContext, useState } from "react"
const Ctx = createContext(null)
export const useCtx = () => useContext(Ctx)
export default function Provider({ children }) {
  const [state, setState] = useState({})
  return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>
}
