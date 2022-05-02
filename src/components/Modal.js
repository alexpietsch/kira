import ReactDOM from 'react-dom'
import './Modal.css'

export default function Modal({ children, customWidth }) {
  return ReactDOM.createPortal((
    <div className="modal-backdrop">
      <div className="modal" style={{ width: customWidth}}>
        {children}
      </div>
    </div>
  ), document.body)
}
