import { Global } from '@emotion/react'

const Fonts = function () {
  return (
    <Global
      styles={`
      @font-face {
        font-family: Cascadia Mono-SemiLight;
        src: url("fonts/CascadiaMono-SemiLight.woff2") format("woff2");
        font-style: normal;
        font-weight: 400;
      }
      `}
    />
  )
}

export default Fonts
