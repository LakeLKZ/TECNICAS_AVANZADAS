using System.Text.Json.Serialization;

namespace backend.Models
{
    public enum Position
    {
        [JsonPropertyName("FLOATING_MAIN")]
        FLOATING_MAIN,

        [JsonPropertyName("HEADER")]
        HEADER,

        [JsonPropertyName("RIGHT_SIDE")]
        RIGHT_SIDE,

        [JsonPropertyName("FOOTER")]
        FOOTER
    }

    public enum RenewalType
    {
        [JsonPropertyName("MANUAL")]
        MANUAL,

        [JsonPropertyName("AUTOMATIC")]
        AUTOMATIC
    }

    public enum RenewalPeriod
    {
        [JsonPropertyName("DAYS_30")]
        DAYS_30,

        [JsonPropertyName("DAYS_60")]
        DAYS_60,

        [JsonPropertyName("DAYS_90")]
        DAYS_90
    }
}