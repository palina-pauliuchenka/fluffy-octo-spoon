import React, { Component } from 'react';

class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            jsonData: null,
            filePath: '/test2.csv',
        };
    }

    handleFileSubmit = (event) => {
        event.preventDefault();
        const { file } = this.state;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const json = this.csvToJson(text);
                console.log("Parsed Data:", json);
                this.setState({ jsonData: json });
                this.props.set_data(json);
            };
            reader.readAsText(file);
        }
    };

    handleDefaultFile = () => {
        const { filePath } = this.state;

        if (filePath && filePath.startsWith('/')) {
            fetch(filePath)
                .then(response => response.text())
                .then(text => {
                    const json = this.csvToJson(text);
                    console.log("Fetched Data:", json);
                    this.setState({ jsonData: json });
                    this.props.set_data(json);
                })
                .catch(error => {
                    console.error('Error fetching the default CSV file:', error);
                });
        } else {
            console.error('Invalid file path. The path must be a relative path inside the public folder.');
        }
    };

    csvToJson = (csv) => {
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(",");
            const obj = {};

            headers.forEach((header, index) => {
                obj[header.trim()] = currentLine[index]?.trim();
            });

            if (Object.keys(obj).length && lines[i].trim()) {
                const parsedObj = {
                    Date: new Date(obj.Date),
                    ...headers.slice(1).reduce((acc, header, index) => {
                        acc[header] = parseInt(obj[header], 10);
                        return acc;
                    }, {}),
                };
                result.push(parsedObj);
            }
        }

        return result;
    };

    render() {
        return (
            <div>
                <h2>Upload a CSV File</h2>
                <form onSubmit={this.handleFileSubmit}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(event) => this.setState({ file: event.target.files[0] })}
                    />
                    <button type="submit">Upload</button>
                </form>

                <p style={{marginBottom: '15px'}}>Or enter file name (that is inside /public folder): </p>
                <div>
                    <input
                        type="text"
                        value={this.state.filePath}
                        onChange={(event) => this.setState({ filePath: event.target.value })}
                        style={{ marginRight: '15px' }}
                    />
                    <button onClick={this.handleDefaultFile}>Load Default File</button>
                </div>
            </div>
        );
    }
}

export default FileUpload;




// import React, { Component } from 'react';
//
// class FileUpload extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             file: null,
//             jsonData: null,
//             filePath: '/test2.csv',
//         };
//     }
//
//     // Handle file upload manually
//     handleFileSubmit = (event) => {
//         event.preventDefault();
//         const { file } = this.state;
//
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const text = e.target.result;
//                 const json = this.csvToJson(text);
//                 this.setState({ jsonData: json });
//                 this.props.set_data(json);
//             };
//             reader.readAsText(file);
//         }
//     };
//
//     // Handle automatic file read from default path /public/test2.csv
//     handleSubmitFilePath = async () => {
//         const { filePath } = this.state;
//         try {
//             const response = await fetch(filePath);
//             const text = await response.text();
//             const json = this.csvToJson(text);
//             this.setState({ jsonData: json });
//             this.props.set_data(json);
//         } catch (error) {
//             console.error("Error reading CSV file from path:", error);
//         }
//     };
//
//     // Convert CSV to JSON
//     csvToJson = (csv) => {
//         const lines = csv.split("\n");
//         const headers = lines[0].split(",");
//         const result = [];
//
//         for (let i = 1; i < lines.length; i++) {
//             const currentLine = lines[i].split(",");
//             const obj = {};
//
//             headers.forEach((header, index) => {
//                 obj[header.trim()] = currentLine[index]?.trim();
//             });
//
//             if (Object.keys(obj).length && lines[i].trim()) {
//                 const parsedObj = {
//                     Date: new Date(obj.Date),
//                     GPT4: parseInt(obj["GPT-4"], 10),
//                     Gemini: parseInt(obj["Gemini"], 10),
//                     PaLM2: parseInt(obj["PaLM-2"], 10),
//                     Claude: parseInt(obj["Claude"], 10),
//                     LLaMA31: parseInt(obj["LLaMA-3.1"], 10),
//                 };
//                 result.push(parsedObj);
//             }
//         }
//         return result;
//     };
//
//     render() {
//         const { file, filePath } = this.state;
//
//         return (
//             <div>
//                 <h2>Upload a CSV File</h2>
//
//
//                 <form onSubmit={this.handleFileSubmit}>
//                     <input
//                         type="file"
//                         accept=".csv"
//                         onChange={(event) =>
//                             this.setState({ file: event.target.files[0] })
//                         }
//                     />
//                     <button type="submit">Upload</button>
//                 </form>
//
//
//                 <div style={{ marginTop: "20px" }}>
//                     <h3>OR Load File from Path</h3>
//                     <label htmlFor="filePath">File Path:</label>
//                     <input
//                         type="text"
//                         id="filePath"
//                         value={filePath}
//                         onChange={(e) => this.setState({ filePath: e.target.value })}
//                         style={{ marginLeft: "10px", padding: "5px", width: "70%" }}
//                     />
//                     <button
//                         style={{ marginLeft: "10px" }}
//                         onClick={this.handleSubmitFilePath}
//                     >
//                         Load & Graph File
//                     </button>
//                 </div>
//             </div>
//         );
//     }
// }
//
// export default FileUpload;


// import React, { useState } from 'react';
//
// function FileUpload({ onDataUpload }) {
//     const [file, setFile] = useState(null);
//     const [fileName, setFileName] = useState('');
//
//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             setFile(selectedFile);
//             setFileName(selectedFile.name);
//         }
//     };
//
//     const handleFileUpload = () => {
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const text = e.target.result;
//                 const data = processData(text);
//                 onDataUpload(data);
//             };
//             reader.readAsText(file);
//         }
//     };
//
//     const processData = (csvText) => {
//         const lines = csvText.split("\n").slice(1); // Skip header row
//         const data = lines.map((line) => {
//             const [date, gpt4, gemini, palm2, claude, llama3] = line.split(",");
//             return {
//                 date: new Date(date), // Convert date to a Date object
//                 GPT4: +gpt4,           // Convert string to number
//                 Gemini: +gemini,
//                 PaLM2: +palm2,
//                 Claude: +claude,
//                 LLaMA3: +llama3,
//             };
//         });
//         return data;
//     };
//
//     return (
//         <div>
//             <h2>Upload Hashtag Usage Data</h2>
//
//             <div>
//                 <input
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileChange}
//                 />
//
//                 {fileName && (
//                     <span style={{ marginLeft: '10px', marginRight: '5px', fontSize: "11px" }}>
//                         {fileName}
//                     </span>
//                 )}
//
//                 {file && (
//                     <button onClick={handleFileUpload}>
//                         Upload File
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default FileUpload;