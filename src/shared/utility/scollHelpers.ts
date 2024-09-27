export const scrollToTop = () => {
  // Scroll to the top of the page when the component mounts
  const el = document.getElementById('mainAppBody')
  el && el.scroll(0, 0)
}
