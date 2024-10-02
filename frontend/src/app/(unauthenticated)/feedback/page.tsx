import { BrandGradient } from '@/components/brand-gradient'
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

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
      <BrandGradient />

      <div className="mx-auto max-w-4xl text-center">
        <Typography variant="h1">Sua opinião vale ouro.</Typography>
      </div>

      <Typography className="mt-6 max-w-2xl mx-auto text-center">
        Ajude-nos a melhorar o Chronos compartilhando sua experiência e
        sugestões. Seu feedback é fundamental para continuarmos evoluindo nosso
        produto.
      </Typography>

      <Card className="mt-12 max-w-4xl mx-auto">
        <CardHeader>
          <CardDescription>Seus dados estão seguros conosco.</CardDescription>
          <CardTitle>Formulário de Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="expectation">
              Em uma escala de 1 a 10, quanto o Chronos atende às suas
              expectativas?
            </Label>
            <Slider
              id="expectation"
              min={1}
              max={10}
              step={1}
              defaultValue={[5]}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Não atende</span>
              <span>10 - Supera as expectativas</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Se o Chronos deixasse de existir amanhã, como você se sentiria?
            </Label>
            <RadioGroup defaultValue="somewhat">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very" id="very" />
                <Label htmlFor="very">Muito desapontado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="somewhat" />
                <Label htmlFor="somewhat">Um pouco desapontado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not" id="not" />
                <Label htmlFor="not">Não faria diferença</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestion">
              Que sugestões você tem para melhorarmos o Chronos?
            </Label>
            <Textarea id="suggestion" placeholder="Compartilhe aqui..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail (opcional)</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
            <Typography
              variant="small"
              className="text-muted-foreground font-light text-xs mt-0.5"
            >
              Informe seu e-mail se quiser receber atualizações sobre as
              melhorias implementadas.
            </Typography>
          </div>

          <Button type="submit" variant="accent" className="w-full">
            Enviar feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
