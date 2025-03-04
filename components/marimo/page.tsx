import Image from "next/image"

import marimo from "@marimo/public/images/marimo.svg"

const Marimo = () => {
  return (
    <div>
      <Image src={marimo} alt="Marimo" />
    </div>
  )
}
export default Marimo
