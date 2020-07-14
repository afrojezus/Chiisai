//
//  SakuraError.swift
//  Chiisai
//
//  Created by Thor on 13/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Foundation

enum SakuraError: String, LocalizedError {
    case cantExtractVideoId = "Couldn't extract video id from the url"
    case cantConstructRequestUrl = "Couldn't construct URL for youtube info request"
    case noDataInResponse = "No data in youtube info response"
    case cantConvertDataToString = "Couldn't convert response data to string"
    case cantExtractFmtStreamMap = "Couldn't extract url_encoded_fmt_stream_map from youtube response"
    case unkown = "Unknown error occured"
    
    var errorDescription: String? {
        return self.rawValue
    }
}

struct YoutubeError: LocalizedError {
    var errorDescription: String?
    
    init?(errorDescription: String?) {
        guard let errorDescription = errorDescription else {
            return nil
        }
        
        self.errorDescription = errorDescription
    }
}
