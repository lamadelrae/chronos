'use client'

import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DiaryEntry, UpdateDiaryEntryRequest } from '@/types/diary'

import { DiaryEntryForm } from './diary-entry-form'

interface DiaryEntryCardProps {
  entry: DiaryEntry
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (data: UpdateDiaryEntryRequest) => void
  onDelete: () => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function DiaryEntryCard({
  entry,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: DiaryEntryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editar Entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <DiaryEntryForm
            entry={entry}
            onSubmit={() => {}} // Not used in edit mode
            onUpdate={onUpdate}
            onCancel={onCancelEdit}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{entry.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="whitespace-pre-wrap text-sm">{entry.content}</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Criado em: {formatDateTime(entry.createdAt)}</span>
            {entry.lastUpdate !== entry.createdAt && (
              <span>Atualizado em: {formatDateTime(entry.lastUpdate)}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}