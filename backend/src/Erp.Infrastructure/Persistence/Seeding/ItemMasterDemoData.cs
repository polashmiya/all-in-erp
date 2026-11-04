namespace Erp.Infrastructure.Persistence.Seeding;

internal static class ItemMasterDemoData
{
    public sealed record SubCategory(string Name, string[] MinorCategories, bool IsActive = true);

    public sealed record Category(string Code, string Name, SubCategory[] SubCategories);

    public sealed record Department(string Code, string Name, Category[] Categories, bool IsActive = true);

    public sealed record Uom(string Code, string Name, string? Description, int? Decimals = null, bool IsActive = true);

    private static readonly Category Tablet = new("TAB", "Tablet",
    [
        new("Film coated", ["Analgesic & antipyretic", "Antibiotic", "Antihypertensive", "Antidiabetic"]),
        new("Chewable", ["Antacid", "Vitamin"]),
        new("Extended release", ["Antihypertensive", "Antidiabetic"]),
        new("Effervescent", ["Vitamin C"], IsActive: false),
    ]);

    private static readonly Category Capsule = new("CAP", "Capsule",
    [
        new("Hard gelatin", ["Antibiotic", "Proton pump inhibitor"]),
        new("Soft gelatin", ["Omega-3", "Vitamin E"]),
    ]);

    private static readonly Category Injection = new("INJ", "Injection",
    [
        new("Vial", ["Antibiotic", "Anticoagulant"]),
        new("Ampoule", ["Analgesic", "Antiemetic"]),
        new("Pre-filled syringe", ["Insulin", "Vaccine"]),
    ]);

    private static readonly Category Gloves = new("GLV", "Gloves",
    [
        new("Latex examination", ["Small", "Medium", "Large"]),
        new("Nitrile examination", ["Small", "Medium", "Large"]),
        new("Surgical sterile", ["Size 6.5", "Size 7", "Size 7.5"]),
    ]);

    private static readonly Category Syringes = new("SYN", "Syringes & Needles",
    [
        new("Disposable syringe", ["1 ml", "3 ml", "5 ml", "10 ml"]),
        new("Hypodermic needle", ["21G", "23G", "25G"]),
    ]);

    public static readonly Department[] Dhaka =
    [
        new("PHARMA", "Pharmaceuticals",
        [
            Tablet,
            Capsule,
            new("SYR", "Syrup & Suspension",
            [
                new("Oral suspension", ["Antibiotic", "Antacid"]),
                new("Paediatric syrup", ["Cough & cold", "Paracetamol"]),
            ]),
            Injection,
            new("TOP", "Ointment & Cream",
            [
                new("Ointment", ["Antifungal", "Antibacterial"]),
                new("Cream", ["Steroid", "Moisturiser"]),
                new("Gel", ["Pain relief"]),
            ]),
            new("DRP", "Drops",
            [
                new("Eye drops", ["Lubricant", "Antibiotic"]),
                new("Ear drops", ["Antibiotic"]),
                new("Oral drops", ["Vitamin D", "Colic relief"]),
            ]),
        ]),
        new("OTC", "OTC & Wellness",
        [
            new("VIT", "Vitamins & Supplements",
            [
                new("Multivitamin", ["Adult", "Children"]),
                new("Calcium & Vitamin D", ["Tablet", "Chewable"]),
                new("Iron & Folic acid", ["Pregnancy care"]),
            ]),
            new("ORS", "Oral Rehydration",
            [
                new("Standard ORS", ["Sachet 500 ml"]),
                new("Flavoured ORS", ["Orange", "Lemon"]),
            ]),
        ]),
        new("SURG", "Surgical & Devices",
        [
            Gloves,
            Syringes,
            new("DRS", "Dressings",
            [
                new("Gauze", ["Swab", "Roll"]),
                new("Bandage", ["Crepe", "Elastic"]),
                new("Adhesive plaster", ["Strip", "Roll"]),
            ]),
            new("DGN", "Diagnostic Devices",
            [
                new("Thermometer", ["Digital", "Infrared"]),
                new("BP monitor", ["Arm", "Wrist"]),
                new("Glucometer", ["Meter", "Test strip"]),
            ]),
        ]),
        new("CONS", "Consumables",
        [
            new("PPE", "Protective Equipment",
            [
                new("Face mask", ["Surgical 3-ply", "KN95"]),
                new("Gown", ["Isolation", "Surgical"]),
                new("Face shield", ["Reusable", "Disposable"]),
            ]),
            new("HYG", "Hygiene",
            [
                new("Hand sanitizer", ["Gel", "Liquid"]),
                new("Antiseptic liquid", ["Chlorhexidine", "Povidone-iodine"]),
            ]),
        ]),
        new("HERB", "Herbal (discontinued)",
        [
            new("HRB", "Herbal Medicine", [new("Herbal syrup", ["Digestive"])]),
        ], IsActive: false),
    ];

    public static readonly Department[] Chattogram =
    [
        new("PHARMA", "Pharmaceuticals", [Tablet, Capsule, Injection]),
        new("SURG", "Surgical & Devices", [Gloves, Syringes]),
    ];

    public static readonly IReadOnlyDictionary<string, Department[]> ByUnit = new Dictionary<string, Department[]>
    {
        ["DHK"] = Dhaka,
        ["CTG"] = Chattogram,
    };

    public static readonly Uom[] Uoms =
    [
        new("PCS", "Pieces", "Single unit"),
        new("BOX", "Box", "Box of strips, vials or pieces"),
        new("STRIP", "Strip", "Blister strip of tablets or capsules"),
        new("BTL", "Bottle", "Syrup, suspension or drops"),
        new("VIAL", "Vial", "Injection vial"),
        new("AMP", "Ampoule", "Injection ampoule"),
        new("TUBE", "Tube", "Ointment, cream or gel"),
        new("SACHET", "Sachet", "ORS and powder sachets"),
        new("PAIR", "Pair", "Gloves"),
        new("ROLL", "Roll", "Gauze, bandage or plaster roll"),
        new("PKT", "Packet", null),
        new("CTN", "Carton", "Shipping carton"),
        new("KG", "Kilogram", "1 KG = 1000 G", 3),
        new("G", "Gram", null, 2),
        new("L", "Litre", "1 L = 1000 ML", 3),
        new("ML", "Millilitre", null, 2),
        new("M", "Metre", "Tubing and bandage by length", 2),
        new("DZN", "Dozen", "Replaced by PCS", IsActive: false),
    ];
}
