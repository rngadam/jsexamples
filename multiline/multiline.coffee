hello = """
\tindented by 2 spaces
\tindented by 2 spaces
\tindented by 2 spaces
\tindented by 2 spaces

"""

hello += """
\talso indented by 2 spaces
\talso indented by 2 spaces
\talso indented by 2 spaces
"""

hello = hello.replace(/\t/g, '  ')
console.log(hello)
