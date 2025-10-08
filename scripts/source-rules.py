#!/usr/bin/env python3

import urllib.request
import ssl
import json
import os
import re

def download_file(url, local_path):
    # Create SSL context that doesn't verify certificates
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    with urllib.request.urlopen(url, context=ssl_context) as response:
        with open(local_path, 'wb') as file:
            file.write(response.read())

class Consumer:
    def __init__(self):
        self.mode = 'index'
        self.params = {'found_contents': False}
        self.buffer = []

    def consume(self, line):
        match self.mode:
            case 'index':
                self.consume_index(line)
            case 'rules':
                self.consume_rules(line)
            case 'glossary':
                self.consume_glossary(line)
            case 'finished':
                return
            case _:
                print(f"Invalid mode: {self.mode}")
                raise ValueError(f"Invalid mode: {self.mode}")

    def consume_index(self, line):
        if not line: return

        if not self.params['found_contents']:
            if line == 'Contents':
                self.params['found_contents'] = True
            return

        if line == 'Glossary': 
            with open('data/index.txt', 'w') as f:
                f.write('\n'.join(self.buffer))
            self.buffer = []
            self.mode = 'rules'
            self.params = {'found_start': False, 'current_rule': None}
            return

        self.buffer.append(line)

    def consume_rules(self, line):
        if not line: return

        if not self.params['found_start']:
            if line == '1. Game Concepts':
                self.params['found_start'] = True
            return

        leading_num = re.match(r'^(\d{3})\.', line)
        if leading_num:
            if not self.params['current_rule']:
                self.params['current_rule'] = leading_num.group(1)
                self.buffer.append(line)
                return
            if self.params['current_rule'] != leading_num.group(1):
                with open(f'data/rules/{self.params["current_rule"]}.txt', 'w') as f:
                    f.write('\n'.join(self.buffer))
                self.buffer = []
                self.params['current_rule'] = leading_num.group(1)
                return
            self.buffer.append(line)
            return
        else:
            if line == 'Glossary':
                with open(f'data/rules/{self.params["current_rule"]}.txt', 'w') as f:
                    f.write('\n'.join(self.buffer))
                self.buffer = []
                self.mode = 'glossary'
                self.params = {'current_term': None}
                return
            else:
                self.buffer.append(line)
                return

    def consume_glossary(self, line):
        if line == 'Credits':
            self.mode = 'finished'
            return
        if not line:
            if self.params['current_term']:
                filename = re.sub(r'[^a-z]', '_', self.params['current_term'].lower())
                with open(f'data/glossary/{filename}.txt', 'w') as f:
                    f.write('\n'.join(self.buffer))
                self.buffer = []
            self.params['current_term'] = None
            return

        if not self.params['current_term']:
            # Not currently consuming a definition -> this is a term
            self.params['current_term'] = line
            return
        else:
            # Currently consuming a definition -> this is a definition
            self.buffer.append(line)


def main():
    print("Creating data directories...")
    os.makedirs('data/rules', exist_ok=True)
    os.makedirs('data/glossary', exist_ok=True)
    
    print("Downloading rules...")
    download_file("https://media.wizards.com/2025/downloads/MagicCompRules%2020250919.txt", "data/full_rules.txt")

    print("Consuming...")
    consumer = Consumer()
    for line in open("data/full_rules.txt"):
        consumer.consume(line.strip())

if __name__ == "__main__":
    main()