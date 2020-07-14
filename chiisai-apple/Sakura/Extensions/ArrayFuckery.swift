//
//  ArrayFuckery.swift
//  Chiisai
//
//  Created by Thor on 13/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Foundation

extension Array {
    
    subscript (safe index: Int) -> Element? {
        return Int(index) < count ? self[Int(index)] : nil
    }
}
