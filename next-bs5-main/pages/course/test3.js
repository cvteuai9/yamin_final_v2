import { LazyLoadImage } from 'react-lazy-load-image-component'

function ImageComponent() {
  return (
    <LazyLoadImage
      alt="My Image"
      src="https://example.com/image.jpg"
      effect="blur"
    />
  )
}
