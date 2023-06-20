using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class EncoderController : ControllerBase
{
    private readonly ILogger<EncoderController> _logger;

    public EncoderController(ILogger<EncoderController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task Get([FromQuery] string input)
    {
        string processed = Convert.ToBase64String(Encoding.UTF8.GetBytes(input));

        Response.Headers.Add("Content-Type", "text/event-stream");

        for (int i = 0; i < processed.Length; i++)
        {
            await Task.Delay(TimeSpan.FromSeconds(new Random().Next(1, 5)));
            string dataItem = $"data: {processed[i]}\n\n";
            byte[] dataItemBytes = Encoding.ASCII.GetBytes(dataItem);
            await Response.Body.WriteAsync(dataItemBytes, 0, dataItemBytes.Length);
            await Response.Body.FlushAsync();
        }
    }
}
