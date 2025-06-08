using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Data;
using Npgsql;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBanners()
        {
            const string sql = @"
            SELECT id,
                   image_url,
                   client_link,
                   start_date,
                   end_date,
                   position::text           AS position,
                   display_order,
                   renewal_type::text       AS renewalType,
                   auto_renewal_period::text AS autoRenewalPeriod
              FROM banners
             ORDER BY id;";

            await _context.Database.OpenConnectionAsync();
            using var cmd = _context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = sql;

            var list = new List<object>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    id = reader.GetInt32("id"),
                    userId = 0,
                    imageUrl = reader.GetString("image_url"),
                    clientLink = reader.GetString("client_link"),
                    startDate = reader.GetDateTime("start_date"),
                    endDate = reader.IsDBNull("end_date")
                                          ? (DateTime?)null
                                          : reader.GetDateTime("end_date"),
                    position = reader.GetString("position"),
                    displayOrder = reader.GetInt32("display_order"),
                    renewalType = reader.GetString("renewalType"),
                    autoRenewalPeriod = reader.IsDBNull("autoRenewalPeriod")
                                          ? null
                                          : reader.GetString("autoRenewalPeriod")
                });
            }
            await _context.Database.CloseConnectionAsync();
            return Ok(list);
        }

        // GET: api/banners/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBanner(int id)
        {
            var sql = @"
        SELECT ""Id"", ""ImageUrl"", ""ClientLink"", ""StartDate"", ""EndDate"", 
               ""Position""::text as ""Position"", ""DisplayOrder"", 
               ""RenewalType""::text as ""RenewalType"", 
               ""AutoRenewalPeriod""::text as ""AutoRenewalPeriod""
        FROM ""Banners""
        WHERE ""Id"" = @id";

            using var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;
            command.Parameters.Add(new Npgsql.NpgsqlParameter("@id", id));

            await _context.Database.OpenConnectionAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var banner = new
                {
                    id = reader.GetInt32("Id"),
                    imageUrl = reader.GetString("ImageUrl"),
                    clientLink = reader.GetString("ClientLink"),
                    startDate = reader.GetDateTime("StartDate"),
                    endDate = reader.IsDBNull("EndDate") ? (DateTime?)null : reader.GetDateTime("EndDate"),
                    position = reader.GetString("Position"),
                    displayOrder = reader.GetInt32("DisplayOrder"),
                    renewalType = reader.GetString("RenewalType"),
                    autoRenewalPeriod = reader.IsDBNull("AutoRenewalPeriod") ? null : reader.GetString("AutoRenewalPeriod")
                };

                await _context.Database.CloseConnectionAsync();
                return Ok(banner);
            }

            await _context.Database.CloseConnectionAsync();
            return NotFound();
        }

        // POST: api/banners
        [HttpPost]
        public async Task<IActionResult> PostBanner([FromBody] Banner banner)
        {
            const string sql = @"
            INSERT INTO banners
              (user_id, image_url, client_link, start_date, end_date,
               position, display_order, renewal_type, auto_renewal_period)
            VALUES
              (0, @img, @link, @start, @end,
               CAST(@pos AS banner_position), @order,
               CAST(@ren AS renewaltype), CAST(@auto AS renewalperiod))
            RETURNING id;";

            using var cmd = _context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = sql;
            cmd.Parameters.AddRange(new[]
            {
            new NpgsqlParameter("@img",   banner.ImageUrl),
            new NpgsqlParameter("@link",  banner.ClientLink),
            new NpgsqlParameter("@start", banner.StartDate),
            new NpgsqlParameter("@end",   (object?)banner.EndDate ?? DBNull.Value),
            new NpgsqlParameter("@pos",   banner.Position.ToString()),
            new NpgsqlParameter("@order", banner.DisplayOrder),
            new NpgsqlParameter("@ren",   banner.RenewalType.ToString()),
            new NpgsqlParameter("@auto",  (object?)banner.AutoRenewalPeriod ?? DBNull.Value)
        });

            await _context.Database.OpenConnectionAsync();
            var newId = (int)await cmd.ExecuteScalarAsync();
            await _context.Database.CloseConnectionAsync();

            // Armamos exactamente el objeto que tu Angular espera
            var created = new
            {
                id = newId,
                userId = 0,
                imageUrl = banner.ImageUrl,
                clientLink = banner.ClientLink,
                startDate = banner.StartDate,
                endDate = banner.EndDate,
                position = banner.Position.ToString(),
                displayOrder = banner.DisplayOrder,
                renewalType = banner.RenewalType.ToString(),
                autoRenewalPeriod = banner.AutoRenewalPeriod?.ToString()
            };

            return CreatedAtAction(nameof(GetBanners), new { id = newId }, created);
        }


        // PUT: api/banners/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBanner(int id, Banner banner)
        {
            if (id != banner.Id)
            {
                return BadRequest();
            }

            _context.Entry(banner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BannerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/banners/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
            {
                return NotFound();
            }

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BannerExists(int id)
        {
            return _context.Banners.Any(e => e.Id == id);
        }
    }
}
