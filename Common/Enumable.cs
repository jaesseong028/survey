
using System.ComponentModel;

namespace UBSurvey.Common
{
    public enum UbSurveyApprove
    {
        [Description("미승인")]

        UnApprove = 0,
        [Description("승인")]
        Approve =  1,
    }
}