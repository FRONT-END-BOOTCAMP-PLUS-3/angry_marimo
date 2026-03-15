import Image from "next/image"

import styles from "@marimo/components/loading/index.module.css"

export const Loading = () => {
  const { container, bouncing_image } = styles

  return (
    <div className={container}>
      <div> Loading ... </div>
      <Image
        className={bouncing_image}
        src={"/images/marimo.svg"}
        alt="loading-marimo"
        width={200}
        height={200}
      />
    </div>
  )
}
