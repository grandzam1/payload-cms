'use client'

import React, { useCallback, useId, useMemo } from 'react'
import type { GroupFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

import { Marquee } from './Marquee'
import { MarqueeControls, resetMarqueeSettings } from './MarqueeControls'
import { DEFAULT_MARQUEE, resolveMarquee } from './defaults'
import type { MarqueeSettings } from './types'
import './marquee.css'
import './marquee-field.css'

const MarqueeField: GroupFieldClientComponent = ({ path, readOnly }) => {
  const { value, setValue } = useField<Partial<MarqueeSettings> | null>({ path })
  const speedId = useId()
  const sizeId = useId()

  const settings = useMemo(() => resolveMarquee(value ?? DEFAULT_MARQUEE), [value])

  const onChange = useCallback(
    (next: MarqueeSettings) => {
      setValue(next)
    },
    [setValue],
  )

  const onReset = useCallback(() => {
    setValue(resetMarqueeSettings())
  }, [setValue])

  return (
    <div className="field-type marquee-field" id={`field-${path}`}>
      <div className="marquee-field__studio">
        <div className="marquee-field__preview ae-marquee-embed">
          <Marquee settings={settings} />
        </div>
        <MarqueeControls
          disabled={Boolean(readOnly)}
          onChange={onChange}
          onReset={onReset}
          settings={settings}
          sizeInputId={sizeId}
          speedInputId={speedId}
        />
      </div>
    </div>
  )
}

export default MarqueeField
