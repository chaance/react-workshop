import React, { useState, useContext, useRef, forwardRef } from 'react'
import { useId } from '../../useId'
import { wrapEvent } from '../../utils'

const DisclosureContext = React.createContext()

export function Disclosure({
  children,
  open: controlledOpen,
  onChange,
  defaultOpen = false,
  ...props
}) {
  const isControlled = controlledOpen != null
  const { current: startsControlled } = useRef(isControlled)
  if (isControlled !== startsControlled) {
    console.warn('Cannot change from controlled to uncontrolled or vice versa.')
  }

  if (isControlled && defaultOpen) {
    console.warn('defaultOpen should only be used for uncontrolled components.')
  }

  const [isOpen, setIsOpen] = useState(defaultOpen)

  const id = useId(props.id)
  const panelId = `panel-${id}`

  const context = {
    isOpen: isControlled ? controlledOpen : isOpen,
    panelId,
    onSelect: () => {
      onChange && onChange()
      if (!isControlled) {
        setIsOpen(!isOpen)
      }
    }
  }

  return (
    <DisclosureContext.Provider
      children={typeof children === 'function' ? children({ ...context }) : children}
      value={context}
    />
  )
}

export const DisclosureButton = forwardRef(
  ({ children, onClick, ...props }, forwardedRef) => {
    const { isOpen, panelId, onSelect } = useContext(DisclosureContext)

    return (
      <button
        {...props}
        onClick={wrapEvent(onClick, onSelect)}
        data-disclosure-button=""
        data-state={isOpen ? 'open' : 'collapsed'}
        aria-expanded={isOpen}
        aria-controls={panelId}
        ref={forwardedRef}
      >
        {children}
      </button>
    )
  }
)

DisclosureButton.displayName = 'DisclosureButton'

export const DisclosurePanel = forwardRef(({ children, ...props }, forwardedRef) => {
  const { isOpen, panelId } = useContext(DisclosureContext)

  return (
    <div
      {...props}
      id={panelId}
      hidden={!isOpen}
      data-disclosure-panel=""
      data-state={isOpen ? 'open' : 'collapsed'}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

DisclosurePanel.displayName = 'DisclosurePanel'
