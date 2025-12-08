import jsPDF from 'jspdf'
import { FaceCritique } from '@/hooks/useFaceCritique'

export const generatePDF = async (critique: FaceCritique, imageUrl: string | null): Promise<void> => {
  const doc = new jsPDF()
  
  // PDF complètement vide - aucun contenu
  
  // Télécharger le PDF avec un nom unique à chaque fois
  const fileTimestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  const fileName = `analyse-faciale-${fileTimestamp}-${random}.pdf`
  
  doc.save(fileName)
}
