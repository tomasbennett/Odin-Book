import { allowedImgTypes } from "../../../../../shared/features/files/constants";
import { IFileDetails } from "../../../../../shared/features/files/models/IFileDetails";
import { FileIcon } from "../../../assets/icons/FileIcon";
import { formatFileSize } from "../../../util/FormatBytes";
import { useInputMessage } from "../hooks/useInputMessage";
import styles from "./FileElement.module.css";
import { TextFileElement } from "./TextFileElement";



type IFileElementProps = {
    fileId: string,
    fileDetails: IFileDetails,
    removeFile?: ReturnType<typeof useInputMessage>["removeFile"]
}


export function FileElementComponent({
    fileId,
    fileDetails,
    removeFile
}: IFileElementProps) {




    console.log(`SO I GUESS THIS IS REMOVE FILE???: ${removeFile}`);




    return (
        <>
            <div className={styles.outerContainer}>

                {
                    allowedImgTypes.includes(fileDetails.mimetype) ? (
                        <>

                            <div className={styles.imgContainer}>
                                <img src={fileDetails.publicUrl} alt={`Image file prepped for sending`} />
                                {
                                    removeFile &&
                                    <div className={`${styles.removeImgContainer} ${styles.removeFileContainer}`}>
                                        <button onClick={() => removeFile(fileId)} className={styles.removeFileButton}>X</button>
                                    </div>
                                }
                            </div>

                        </>
                    )

                        :

                        (
                            <TextFileElement
                                fileDetails={fileDetails}
                                removeFile={removeFile}
                            />
                        )



                }






            </div>
        </>
    )
}