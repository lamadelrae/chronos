'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { BrandGradient } from '@/components/brand-gradient'
import { Loader } from '@/components/states/loader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'

const feedbackSchema = z.object({
  expectation: z.number().min(1).max(10),
  feeling: z.enum(['very', 'somewhat', 'not']),
  suggestion: z.string().min(1, 'Por favor, forneça uma sugestão'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      expectation: 5,
      feeling: 'somewhat',
      suggestion: '',
      email: '',
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    toast.success('Enviado!')
    setIsSubmitted(true)

    reset()
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
      <BrandGradient />

      <div className="mx-auto max-w-4xl text-center">
        <Typography variant="h1"> Sua opinião vale ouro.</Typography>
      </div>

      <Typography className="mt-6 max-w-2xl mx-auto text-center">
        Ajude-nos a melhorar o Chronos compartilhando sua experiência e
        sugestões. Seu feedback é fundamental para continuarmos evoluindo nosso
        produto.
      </Typography>

      <Card className="mt-12 max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-muted/50">
          <CardDescription>Seus dados estão seguros conosco.</CardDescription>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <Typography variant="h3" className="mt-4">
                Obrigado pelo seu feedback!
              </Typography>
              <Typography className="mt-2 text-muted-foreground">
                Sua opinião é muito importante para nós e nos ajudará a melhorar
                o Chronos.
              </Typography>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="expectation" className="text-lg font-medium">
                  Em uma escala de 1 a 10, quanto o Chronos atende às suas
                  expectativas?
                </Label>

                <Controller
                  name="expectation"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      id="expectation"
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="my-4"
                    />
                  )}
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 - Não atende</span>
                  <span>10 - Supera as expectativas</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Se o Chronos deixasse de existir amanhã, como você se
                  sentiria?
                </Label>
                <Controller
                  name="feeling"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="very" id="very" />
                        <Label htmlFor="very" className="text-base">
                          Muito desapontado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="somewhat" id="somewhat" />
                        <Label htmlFor="somewhat" className="text-base">
                          Um pouco desapontado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="not" id="not" />
                        <Label htmlFor="not" className="text-base">
                          Não faria diferença
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="suggestion" className="text-lg font-medium">
                  Que sugestões você tem para melhorarmos o Chronos?
                </Label>
                <Controller
                  name="suggestion"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="suggestion"
                      placeholder="Compartilhe aqui..."
                      {...field}
                      className="min-h-[100px]"
                    />
                  )}
                />
                {errors.suggestion && (
                  <Typography variant="small" className="text-red-500">
                    {errors.suggestion.message}
                  </Typography>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg font-medium">
                  Seu e-mail (opcional)
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <Typography variant="small" className="text-red-500">
                    {errors.email.message}
                  </Typography>
                )}
                <Typography
                  variant="small"
                  className="text-muted-foreground font-light text-xs mt-1"
                >
                  Informe seu e-mail se quiser receber atualizações sobre as
                  melhorias implementadas.
                </Typography>
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader /> : 'Enviar feedback'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
