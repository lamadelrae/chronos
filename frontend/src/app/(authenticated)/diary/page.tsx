'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { deleteDiaryEntry } from '@/api/diary/delete-diary-entry'
import { getDiaryEntries } from '@/api/diary/get-diary-entries'
import { saveDiaryEntry } from '@/api/diary/save-diary-entry'
import { updateDiaryEntry } from '@/api/diary/update-diary-entry'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CreateDiaryEntryRequest, DiaryEntry, UpdateDiaryEntryRequest } from '@/types/diary'

import { DiaryEntryCard } from './diary-entry-card'
import { DiaryEntryForm } from './diary-entry-form'

export default function DiaryPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const queryClient = useQueryClient()

  const { data: entries, isLoading } = useQuery({
    queryKey: ['diary-entries'],
    queryFn: () => getDiaryEntries(),
  })

  const saveMutation = useMutation({
    mutationFn: saveDiaryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['diary-entries'])
      setIsCreating(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiaryEntryRequest }) =>
      updateDiaryEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['diary-entries'])
      setEditingEntry(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDiaryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['diary-entries'])
    },
  })

  const handleSave = (data: CreateDiaryEntryRequest) => {
    saveMutation.mutate(data)
  }

  const handleUpdate = (id: string, data: UpdateDiaryEntryRequest) => {
    updateMutation.mutate({ id, data })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return <DiaryPageSkeleton />
  }

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Diário</h1>
            <p className="text-muted-foreground">
              Registre suas atividades e reflexões do dia a dia
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Entrada
          </Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Entrada do Diário</CardTitle>
              <CardDescription>
                Registre uma nova entrada no seu diário de negócios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiaryEntryForm
                onSubmit={handleSave}
                onCancel={() => setIsCreating(false)}
                isLoading={saveMutation.isLoading}
              />
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {entries?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma entrada encontrada. Comece criando sua primeira entrada!
                </p>
              </CardContent>
            </Card>
          ) : (
            entries?.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                isEditing={editingEntry?.id === entry.id}
                onEdit={() => setEditingEntry(entry)}
                onCancelEdit={() => setEditingEntry(null)}
                onUpdate={(data) => handleUpdate(entry.id, data)}
                onDelete={() => handleDelete(entry.id)}
                isUpdating={updateMutation.isLoading}
                isDeleting={deleteMutation.isLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function DiaryPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )
}