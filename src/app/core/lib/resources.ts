export class Resources {
    public static readonly TableDoesNotExist = "Table '{0}' does not exist.";
    public static readonly RowDoesNotHaveChildRelation = "The row does not have child relation.";
    public static readonly RowDoesNotHaveParentRelation = "The row does not have parent relation.";
    public static readonly CannotFindParentRow = "Cannot find parent row when evaluating row is null.";
    public static readonly CannotFindChildRow = "Cannot find child row when evaluating row is null.";
    public static readonly EntryNameNotExist = "Entry name '{0}' does not exist.";
    public static readonly ValueCanNotNull = "Value cannot be null.";
    public static readonly NotSupportedError = "Not supported '{0}'.";
    public static readonly IncorrectSyntaxError = "Incorrect syntax near '{0}'.";
    public static readonly UnclosedQuotationError = "Unclosed quotation mark after the character '{0}'.";
    public static readonly ArgumentNullError = "ArgumentNullException: Value cannot be null. Parameter name: '{0}'";
    public static readonly RequiredFunctionArgument = "The {0} function requires {1} argument(s).";
    public static readonly InvalidParameter = "Invalid parameter data type";
    public static readonly UnknownDatePart = "Unknown datepart '{0}'.";
    public static readonly InvalidOperationError = "Invalid operation '{0}'.";
    public static readonly UnknownLanguage = "Unknown language '{0}'.";
    public static readonly DataConstraint_ParentValues = "This constraint cannot be enabled as not all values have corresponding parent values.";
}