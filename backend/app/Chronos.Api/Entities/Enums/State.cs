using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Chronos.Api.Entities.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum State
{
    [Description("Acre")]
    AC,
    [Description("Alagoas")]
    AL,
    [Description("Amapá")]
    AP,
    [Description("Amazonas")]
    AM,
    [Description("Bahia")]
    BA,
    [Description("Ceara")]
    CE,
    [Description("Distrito Federal")]
    DF,
    [Description("Espirito Santo")]
    ES,
    [Description("Goiás")]
    GO,
    [Description("Maranhão")]
    MA,
    [Description("Mato Grosso")]
    MT,
    [Description("Mato Grosso do Sul")]
    MS,
    [Description("Minas Gerais")]
    MG,
    [Description("Para")]
    PA,
    [Description("Paraíba")]
    PB,
    [Description("Paraná")]
    PR,
    [Description("Pernambuco")]
    PE,
    [Description("Piauí")]
    PI,
    [Description("Rio de Janeiro")]
    RJ,
    [Description("Rio Grande do Norte")]
    RN,
    [Description("Rio Grande do Sul")]
    RS,
    [Description("Rondônia")]
    RO,
    [Description("Roraima")]
    RR,
    [Description("Santa Catarina")]
    SC,
    [Description("São Paulo")]
    SP,
    [Description("Sergipe")]
    SE,
    [Description("Tocantins")]
    TO
}
