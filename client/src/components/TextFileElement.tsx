import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";
import { FileIcon } from "../assets/icons/FileIcon";
import { formatFileSize } from "../util/FormatBytes";
import styles from "./TextFileElement.module.css";


type IFileElementProps = {
    fileDetails: IFileDetails,
    removeFile?: (fileId: string) => void
}



export function TextFileElement({
    fileDetails,
    removeFile
}: IFileElementProps) {

    return (
        <>

            <a
                href={fileDetails.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadableFileContainer}>
                <div className={styles.svgContainer}>
                    <FileIcon />
                </div>

                <div className={`${!!removeFile ? "" : styles.isInputFile} ${styles.textContainer}`}>
                    <p className={styles.fileName}>{fileDetails.name}</p>
                    <p className={styles.fileSize}>{`File size: ${formatFileSize(fileDetails.size)}`}</p>
                </div>

                {
                    removeFile &&
                    <div className={`${styles.removeDownloadableContainer} ${styles.removeFileContainer}`}>

                        <button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFile(fileDetails.id);
                        }} className={styles.removeFileButton}>
                            X
                        </button>

                    </div>
                }


            </a>

        </>
    );
}