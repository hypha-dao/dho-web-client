export const forms = {
  computed: {
    defaultToolbar () {
      return [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo'],
        ['fullscreen']
      ]
    },
    fullScreenToolbar () {
      return [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['undo', 'redo'],
        ['viewsource'],
        ['fullscreen']
      ]
    }
  }
}
