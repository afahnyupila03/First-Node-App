const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value

  const productElement = btn.closest('article')

  fetch(`/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken
    }
  })
    .then(res => res.json())
    // return the res body.
    // To delete from th dom as well.
    .then(data => {
      console.log('DATA: ', data)
      productElement.parentNode.removeChild(productElement)
    })
    .catch(err => console.error(err))
}
