'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
}

interface FilterChipsProps {
  chips: FilterChip[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function FilterChips({ chips, selected, onChange, className }: FilterChipsProps) {
  const toggleChip = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant={selected.includes(chip.id) ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-colors',
            selected.includes(chip.id)
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'hover:bg-secondary'
          )}
          onClick={() => toggleChip(chip.id)}
        >
          {chip.label}
        </Badge>
      ))}
    </div>
  )
}
