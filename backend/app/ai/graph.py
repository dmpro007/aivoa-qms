from langgraph.graph import StateGraph, START, END

from app.ai.state import ComplaintState

from app.ai.nodes import (
    extract_complaint,
    check_completeness,
    assess_risk,
    analyze_root_cause,
    recommend_capa,
    generate_summary
)


def build_complaint_graph():

    graph = StateGraph(ComplaintState)

    # Nodes
    graph.add_node("extract", extract_complaint)

    graph.add_node(
        "completeness",
        check_completeness
    )

    graph.add_node(
        "risk",
        assess_risk
    )

    graph.add_node(
        "root_cause",
        analyze_root_cause
    )

    graph.add_node(
        "capa",
        recommend_capa
    )

    graph.add_node(
        "summary",
        generate_summary
    )

    # Workflow
    graph.add_edge(
        START,
        "extract"
    )

    graph.add_edge(
        "extract",
        "completeness"
    )

    graph.add_edge(
        "completeness",
        "risk"
    )

    graph.add_edge(
        "risk",
        "root_cause"
    )

    graph.add_edge(
        "root_cause",
        "capa"
    )

    graph.add_edge(
        "capa",
        "summary"
    )

    graph.add_edge(
        "summary",
        END
    )

    return graph.compile()


complaint_graph = build_complaint_graph()

# from langgraph.graph import StateGraph, START, END

# from app.ai.state import ComplaintState

# from app.ai.nodes import (
#     extract_complaint,
#     check_completeness,
#     assess_risk,
#     generate_summary
# )


# def build_complaint_graph():

#     graph = StateGraph(ComplaintState)

#     # Add nodes

#     graph.add_node(
#         "extract",
#         extract_complaint
#     )

#     graph.add_node(
#         "completeness",
#         check_completeness
#     )

#     graph.add_node(
#         "risk",
#         assess_risk
#     )

#     graph.add_node(
#         "summary",
#         generate_summary
#     )

#     # Define workflow

#     graph.add_edge(
#         START,
#         "extract"
#     )

#     graph.add_edge(
#         "extract",
#         "completeness"
#     )

#     graph.add_edge(
#         "completeness",
#         "risk"
#     )

#     graph.add_edge(
#         "risk",
#         "summary"
#     )

#     graph.add_edge(
#         "summary",
#         END
#     )

#     return graph.compile()


# complaint_graph = build_complaint_graph()