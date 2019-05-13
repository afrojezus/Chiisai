//
//  StringFuckery.swift
//  Chiisai
//
//  Created by Thor on 13/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Foundation

extension String {
    
    func queryComponents() -> [String: String] {
        var pairs: [String: String] = [:]
        
        for pair in self.components(separatedBy: "&") {
            let pairArr = pair.components(separatedBy: "=")
            
            guard pairArr.count == 2,
                let key = pairArr.first?.decodedFromUrl(),
                let value = pairArr.last?.decodedFromUrl() else {
                    continue
            }
            
            pairs[key] = value
        }
        
        return pairs
    }
    
    func decodedFromUrl() -> String? {
        return self.replacingOccurrences(of: "+", with: " ").removingPercentEncoding
    }
}
