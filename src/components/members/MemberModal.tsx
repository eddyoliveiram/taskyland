import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FamilyMember, FamilyMemberInput, MEMBER_COLORS } from '@/types/family'
import { Trash2 } from 'lucide-react'

interface MemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: FamilyMember
  onSave: (data: FamilyMemberInput) => Promise<void>
  onDelete?: () => Promise<void>
}

export function MemberModal({ open, onOpenChange, member, onSave, onDelete }: MemberModalProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(MEMBER_COLORS[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (member) {
      setName(member.name)
      setSelectedColor(member.color)
    } else {
      setName('')
      setSelectedColor(MEMBER_COLORS[0])
    }
  }, [member, open])

  const handleSave = async () => {
    if (!name.trim()) return

    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        color: selectedColor,
      })
      setName('')
      setSelectedColor(MEMBER_COLORS[0])
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return

    setSaving(true)
    try {
      await onDelete()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? 'Editar Membro' : 'Adicionar Membro'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Digite o nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave()
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Cor de Identificação</Label>
            <div className="grid grid-cols-5 gap-3">
              {MEMBER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-12 h-12 rounded-full transition-transform ${
                    selectedColor === color ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="text-2xl font-bold text-white">
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <p className="font-semibold">{name || 'Nome do membro'}</p>
              <p className="text-sm text-muted-foreground">Visualização</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {member && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
