import * as React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

const GLOBAL_MODAL_EVENT = 'acegrid:global-modal'

type ModalControls = {
  close: () => void
}

type ModalSlot =
  | React.ReactNode
  | ((controls: ModalControls) => React.ReactNode)

export type GlobalModalOptions = {
  title?: React.ReactNode
  description?: React.ReactNode
  body?: ModalSlot
  footer?: ModalSlot
  showCloseButton?: boolean
  showFooterCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  contentClassName?: string
  onOpenChange?: (open: boolean) => void
}

type ModalEvent =
  | {
      type: 'open'
      options: GlobalModalOptions
    }
  | {
      type: 'update'
      options: Partial<GlobalModalOptions>
    }
  | {
      type: 'close'
    }

function dispatchModalEvent(event: ModalEvent) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent<ModalEvent>(GLOBAL_MODAL_EVENT, {
      detail: event,
    }),
  )
}

export const modal = {
  open: (options: GlobalModalOptions) => {
    dispatchModalEvent({
      type: 'open',
      options,
    })
  },
  update: (options: Partial<GlobalModalOptions>) => {
    dispatchModalEvent({
      type: 'update',
      options,
    })
  },
  close: () => {
    dispatchModalEvent({
      type: 'close',
    })
  },
}

function renderModalSlot(slot: ModalSlot | undefined, controls: ModalControls) {
  if (typeof slot === 'function') {
    return slot(controls)
  }

  return slot
}

export function GlobalModalProvider() {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<GlobalModalOptions>()

  const controls = React.useMemo<ModalControls>(
    () => ({
      close: modal.close,
    }),
    [],
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleEvent = (event: Event) => {
      const detail = (event as CustomEvent<ModalEvent>).detail

      switch (detail.type) {
        case 'open':
          setOptions(detail.options)
          setOpen(true)
          return
        case 'update':
          setOptions((previousOptions) => {
            if (!previousOptions) {
              return previousOptions
            }

            return {
              ...previousOptions,
              ...detail.options,
            }
          })
          return
        case 'close':
          setOpen(false)
          return
      }
    }

    window.addEventListener(GLOBAL_MODAL_EVENT, handleEvent)

    return () => {
      window.removeEventListener(GLOBAL_MODAL_EVENT, handleEvent)
    }
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    options?.onOpenChange?.(nextOpen)
    setOpen(nextOpen)
  }

  if (!options) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={options.contentClassName}
        showCloseButton={options.showCloseButton ?? true}
        onEscapeKeyDown={(event) => {
          if (options.closeOnEscape === false) {
            event.preventDefault()
          }
        }}
        onInteractOutside={(event) => {
          if (options.closeOnOutsideClick === false) {
            event.preventDefault()
          }
        }}
      >
        {(options.title || options.description) && (
          <DialogHeader>
            {options.title && <DialogTitle>{options.title}</DialogTitle>}
            {options.description && (
              <DialogDescription>{options.description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {renderModalSlot(options.body, controls)}

        {(options.footer || options.showFooterCloseButton) && (
          <DialogFooter
            showCloseButton={options.showFooterCloseButton ?? false}
          >
            {renderModalSlot(options.footer, controls)}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
