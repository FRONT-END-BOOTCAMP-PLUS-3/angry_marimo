import styles from "@marimo/app/(main)/guest-book/[userId]/_components/post-input.module.css"

interface PostInputProps {
  postCreate: (formData: FormData) => Promise<void>
}

export const PostInput = ({ postCreate }: PostInputProps) => {
  const { container, text_area, submit__div, submit__button } = styles

  return (
    <form className={container} action={postCreate}>
      <textarea aria-label="content" name="content" className={text_area} />
      <div className={submit__div}>
        <button className={submit__button}>남기기</button>
      </div>
    </form>
  )
}
