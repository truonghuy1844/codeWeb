//orderd

using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class OrderD
    {
        public string OrderId { get; set; } = null!;

        public string ProductId { get; set; } = null!;

        public string PiId { get; set; } = null!;

        public int? Quantity { get; set; }

        public decimal? Cost { get; set; }

        public decimal? Price { get; set; }

        public string? Tax { get; set; }

        public virtual OrderTb Order { get; set; } = null!;

        public virtual ProductIn Pi { get; set; } = null!;

        public virtual Product Product { get; set; } = null!;

        public virtual Tax? TaxNavigation { get; set; }        
    }
}

