import SummaryComponent from '../SummaryComponent';




// Method to trigger direct PDF download using html2pdf.js (for mobile)
const downloadPdfDirect = (summaryHtml) => {
  if (window.html2pdf) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = summaryHtml;
    document.body.appendChild(tempDiv);
    window.html2pdf()
      .from(tempDiv)
      .set({ margin: 0, filename: 'summary.pdf', html2canvas: { scale: 2 } })
      .save()
      .then(() => document.body.removeChild(tempDiv));
  } else {
    alert('PDF download is not supported on this device/browser.');
  }
};

const MobileSummaryComponent = ({ userResponses, handleOptionSelectCall }) => {
  return (
    <SummaryComponent
      userResponses={userResponses}
      handleOptionSelectCall={handleOptionSelectCall}
      downloadPdfDirect={downloadPdfDirect}
    />
  );
};

export default MobileSummaryComponent;

